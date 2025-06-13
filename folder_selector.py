# folder_selector.py
import tkinter as tk
from tkinter import filedialog

def seleccionar_carpeta():
    root = tk.Tk()
    root.withdraw()  # Oculta la ventana principal
    carpeta = filedialog.askdirectory(title="Selecciona una carpeta para monitorear")
    root.destroy()
    return carpeta
