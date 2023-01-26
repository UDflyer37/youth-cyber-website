from ._anvil_designer import Form1Template
from anvil import *
import anvil.server
import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables
from ..face_scanner import face_scanner
from ..scratch_drawing import scratch_drawing

class Form1(Form1Template):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
    self.face_scanner.add_component(face_scanner(), full_width_row=True)
    self.scratch_drawing.add_component(scratch_drawing(), full_width_row=True)
    








