import os
import glob
import shutil
import warnings
from PIL import Image

warnings.filterwarnings("ignore", category=DeprecationWarning)


def remove_background_simple(image_path, output_path, tolerance=10):
    img = Image.open(image_path).convert("RGBA")
    
    new_data = []
    for pixel in img.getdata():
        r, g, b, a = pixel
        
        if (abs(r - 255) <= tolerance and 
            abs(g - 255) <= tolerance and 
            abs(b - 255) <= tolerance):
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append((r, g, b, a))
    
    img.putdata(new_data)
    img.save(output_path)


def remove_background():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_dir = os.path.join(script_dir, "../assets/images")
    output_dir = os.path.join(script_dir, "../assets/images_nobg")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    if not os.path.exists(input_dir):
        print(f"输入目录不存在: {input_dir}")
        return
    
    image_patterns = ["*.gif", "*.jpg", "*.jpeg", "*.png", "*.webp", "*.svg"]
    image_files = []
    
    for pattern in image_patterns:
        image_files.extend(glob.glob(os.path.join(input_dir, pattern)))
    
    image_files.sort()
    
    if not image_files:
        print("未找到图片文件")
        return
    
    processed_count = 0
    processed_names = set()
    
    print(f"找到 {len(image_files)} 个图片文件:")
    for old_path in image_files:
        old_name = os.path.basename(old_path)
        name_without_ext, ext = os.path.splitext(old_name)
        
        if name_without_ext in processed_names:
            print(f"  跳过: {old_name} (同名文件已处理)")
            continue
        
        processed_names.add(name_without_ext)
        
        if ext.lower() == '.gif':
            output_path = os.path.join(output_dir, old_name)
            print(f"  复制: {old_name} -> {os.path.basename(output_path)}")
            try:
                shutil.copy2(old_path, output_path)
                processed_count += 1
            except Exception as e:
                print(f"    复制失败: {e}")
                processed_names.remove(name_without_ext)
        else:
            output_path = os.path.join(output_dir, f"{name_without_ext}.png")
            print(f"  处理: {old_name} -> {os.path.basename(output_path)}")
            try:
                remove_background_simple(old_path, output_path)
                processed_count += 1
            except Exception as e:
                print(f"    处理失败: {e}")
                processed_names.remove(name_without_ext)
    
    print(f"\n处理完成，共成功处理 {processed_count} 个文件")


if __name__ == "__main__":
    remove_background()