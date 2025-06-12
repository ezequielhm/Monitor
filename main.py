import os
import tkinter as tk
from tkinter import Scrollbar, Entry, Button, messagebox, ttk
import threading
import subprocess
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from docx import Document
from PyPDF2 import PdfReader
import openpyxl
import estilo

CARPETA_OBJETIVO = r".\Monitorear"

class FolderMonitorHandler(FileSystemEventHandler):
    def __init__(self, update_callback):
        self.update_callback = update_callback

    def on_modified(self, event):
        self.update_callback()

    def on_created(self, event):
        self.update_callback()

    def on_deleted(self, event):
        self.update_callback()

class FolderMonitorApp:
    def __init__(self, root, carpeta):
        self.root = root
        self.carpeta = carpeta
        self.root.title("Monitor de Carpeta con Buscador")
        self.root.configure(bg=estilo.COLOR_LISTADO)
        self.root.geometry(f"{estilo.ANCHO_VENTANA}x{estilo.ALTURA_VENTANA}")

        # Cabecera
        cabecera = tk.Frame(root, bg=estilo.COLOR_CABECERA)
        cabecera.pack(fill=tk.X)

        self.entry = Entry(cabecera, width=50, font=estilo.FUENTE_TEXTO)
        self.entry.pack(side=tk.LEFT, padx=10, pady=10)

        self.buscar_btn = Button(
            cabecera,
            text="Buscar por contenido",
            command=self.buscar,
            bg=estilo.COLOR_BOTON,
            fg=estilo.COLOR_TEXTO_BLANCO,
            font=estilo.FUENTE_TEXTO
        )
        self.buscar_btn.pack(side=tk.LEFT, padx=5)

        # Treeview para mostrar archivos en estructura de carpeta
        self.tree = ttk.Treeview(root)
        self.tree.heading('#0', text='Archivos', anchor='w')
        self.tree.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        self.tree.bind("<Double-1>", self.abrir_archivo)

        self.actualizar_lista()

        handler = FolderMonitorHandler(self.actualizar_lista)
        observer = Observer()
        observer.schedule(handler, self.carpeta, recursive=True)
        observer_thread = threading.Thread(target=observer.start)
        observer_thread.daemon = True
        observer_thread.start()

    def actualizar_lista(self):
        carpetas = []
        archivos = []

        for dirpath, dirnames, filenames in os.walk(self.carpeta):
            rel_dir = os.path.relpath(dirpath, self.carpeta)
            if rel_dir == ".":
                rel_dir = ""

            # Añadir carpetas
            for dirname in dirnames:
                ruta = os.path.normpath(os.path.join(rel_dir, dirname))
                carpetas.append(ruta)

            # Añadir archivos
            for filename in filenames:
                ruta = os.path.normpath(os.path.join(rel_dir, filename))
                archivos.append(ruta)

        # Ordenar por nombre
        self.todos_los_archivos = sorted(carpetas) + sorted(archivos)
        self.mostrar_lista(self.todos_los_archivos)


    def mostrar_lista(self, archivos):
        self.tree.delete(*self.tree.get_children())
        nodos = {}
        for archivo_relativo in archivos:
            partes = archivo_relativo.split(os.sep)
            padre = ''
            for i, parte in enumerate(partes):
                ruta_relativa = os.sep.join(partes[:i + 1])
                if ruta_relativa not in nodos:
                    nodo = self.tree.insert(padre, 'end', text=parte, open=True, values=[ruta_relativa])
                    nodos[ruta_relativa] = nodo
                padre = nodos[ruta_relativa]

    def buscar(self):
        palabra = self.entry.get().lower()
        if not palabra:
            self.mostrar_lista(self.todos_los_archivos)
            return

        encontrados = []
        for archivo_rel in self.todos_los_archivos:
            ruta = os.path.join(self.carpeta, archivo_rel)
            if not os.path.isfile(ruta):
                continue

            texto = ""
            nombre = archivo_rel.lower()

            try:
                if nombre.endswith(('.txt', '.md', '.csv', '.log', '.json', '.html', '.js', '.py')):
                    with open(ruta, 'r', encoding='utf-8', errors='ignore') as f:
                        texto = f.read().lower()
                elif nombre.endswith('.docx'):
                    doc = Document(ruta)
                    texto = '\n'.join([p.text for p in doc.paragraphs]).lower()
                elif nombre.endswith('.pdf'):
                    reader = PdfReader(ruta)
                    texto = '\n'.join([page.extract_text() or "" for page in reader.pages]).lower()
                elif nombre.endswith('.xlsx'):
                    wb = openpyxl.load_workbook(ruta, data_only=True)
                    for sheet in wb.worksheets:
                        for row in sheet.iter_rows(values_only=True):
                            texto += ' '.join([str(cell) for cell in row if cell is not None]) + '\n'
                    texto = texto.lower()

                if palabra in texto:
                    encontrados.append(archivo_rel)

            except Exception as e:
                print(f"Error leyendo {archivo_rel}: {e}")

        self.mostrar_lista(encontrados)

    def abrir_archivo(self, event):
        seleccion = self.tree.selection()
        if seleccion:
            ruta_rel = self.tree.item(seleccion[0])['values'][0]
            ruta_completa = os.path.abspath(os.path.join(self.carpeta, ruta_rel))
            if os.path.isfile(ruta_completa):
                try:
                    if os.name == 'nt':
                        os.startfile(ruta_completa)
                    elif os.name == 'posix':
                        subprocess.call(('xdg-open', ruta_completa))
                except Exception as e:
                    messagebox.showerror("Error al abrir archivo", str(e))

if __name__ == "__main__":
    root = tk.Tk()
    app = FolderMonitorApp(root, CARPETA_OBJETIVO)
    root.mainloop()
