import os
import glob


def rename_audio():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    audio_dir = os.path.join(script_dir, "../assets/audio")
    
    if not os.path.exists(audio_dir):
        print(f"目录不存在: {audio_dir}")
        return

    audio_patterns = ["*.mp3", "*.wav", "*.ogg"]
    audio_files = []
    
    for pattern in audio_patterns:
        audio_files.extend(glob.glob(os.path.join(audio_dir, pattern)))
    
    audio_files.sort()
    
    if not audio_files:
        print("未找到音频文件")
        return

    renamed_count = 0
    
    print(f"找到 {len(audio_files)} 个音频文件:")
    for i, old_path in enumerate(audio_files, 1):
        old_name = os.path.basename(old_path)
        ext = os.path.splitext(old_name)[1].lower()
        new_name = f"phoebe_{i:03d}{ext}"
        new_path = os.path.join(audio_dir, new_name)
        
        if old_name == new_name:
            print(f"  {old_name} (名称已正确，跳过)")
        else:
            print(f"  {old_name} -> {new_name}")
            os.rename(old_path, new_path)
            renamed_count += 1
    
    print(f"\n重命名完成，共处理 {renamed_count} 个文件")


if __name__ == "__main__":
    rename_audio()