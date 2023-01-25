from ._anvil_designer import MainTemplate
from anvil import *
import plotly.graph_objects as go
import anvil.server
import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables
 

#https://www.kaggle.com/code/endlesslethe/siwei-digit-recognizer-top20#General-function
class Main(MainTemplate):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)

  def file_loader_1_change(self, file, **event_args):
    """This method is called when a new file is loaded into this FileLoader"""
    self.image_1.source = self.file_loader_1.file
    self.label_2.text = anvil.server.call('analyze',self.image_1)
    

   
    
      
    


