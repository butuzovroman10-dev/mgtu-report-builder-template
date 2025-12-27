import pandas as pd
import matplotlib.pyplot as plt
import os
import glob

def generate_plots_from_repo(repo_path, output_folder):
    """
    Сканирует папку репозитория на наличие CSV или данных и строит графики.
    """
    plot_paths = []
    # Ищем все CSV файлы
    csv_files = glob.glob(os.path.join(repo_path, "**/*.csv"), recursive=True)
    
    if not csv_files:
        return []

    for i, file_path in enumerate(csv_files):
        try:
            df = pd.read_csv(file_path)
            plt.figure(figsize=(10, 6))
            
            # Предполагаем, что первая колонка - X, остальные - Y
            x_col = df.columns[0]
            for col in df.columns[1:]:
                plt.plot(df[x_col], df[col], label=col)
            
            plt.title(f"График для {os.path.basename(file_path)}")
            plt.xlabel(x_col)
            plt.legend()
            plt.grid(True)
            
            plot_name = f"plot_{i}.png"
            save_path = os.path.join(output_folder, plot_name)
            plt.savefig(save_path)
            plt.close()
            plot_paths.append(save_path)
        except Exception as e:
            print(f"Ошибка при создании графика для {file_path}: {e}")
            
    return plot_paths