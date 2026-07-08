import os
import glob
import re


def rename_images():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(script_dir, "../assets/images")
    
    if not os.path.exists(images_dir):
        print(f"目录不存在: {images_dir}")
        return

    image_patterns = ["*.jpg", "*.jpeg", "*.png", "*.gif", "*.webp", "*.svg"]
    image_files = []
    
    for pattern in image_patterns:
        image_files.extend(glob.glob(os.path.join(images_dir, pattern)))
    
    image_files.sort()
    
    if not image_files:
        print("未找到图片文件")
        return

    files_by_ext = {}
    for old_path in image_files:
        old_name = os.path.basename(old_path)
        ext = os.path.splitext(old_name)[1].lower()
        if ext not in files_by_ext:
            files_by_ext[ext] = []
        files_by_ext[ext].append((old_path, old_name))
    
    renamed_count = 0
    
    print(f"找到 {len(image_files)} 个图片文件:")
    for ext in sorted(files_by_ext.keys()):
        files = files_by_ext[ext]
        print(f"\n  [{ext}] 格式共 {len(files)} 个:")
        
        used_numbers = set()
        to_rename = []
        
        for old_path, old_name in files:
            match = re.match(r'^phoebe_(\d{3})' + re.escape(ext) + r'$', old_name)
            if match:
                used_numbers.add(int(match.group(1)))
                print(f"    {old_name} (名称已正确，跳过)")
            else:
                to_rename.append((old_path, old_name))
        
        max_num = max(used_numbers) if used_numbers else 0
        
        vacant_numbers = []
        for n in range(1, max_num + 1):
            if n not in used_numbers:
                vacant_numbers.append(n)
        
        next_number = max_num + 1
        
        for old_path, old_name in to_rename:
            if vacant_numbers:
                new_num = vacant_numbers.pop(0)
            else:
                new_num = next_number
                next_number += 1
            
            new_name = f"phoebe_{new_num:03d}{ext}"
            new_path = os.path.join(images_dir, new_name)
            
            print(f"    {old_name} -> {new_name}")
            os.rename(old_path, new_path)
            renamed_count += 1
    
    print(f"\n重命名完成，共处理 {renamed_count} 个文件")


if __name__ == "__main__":
    rename_images()