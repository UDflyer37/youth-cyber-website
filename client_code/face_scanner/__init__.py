from ._anvil_designer import face_scannerTemplate
from anvil import *
import anvil.server
import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables
 

#https://www.kaggle.com/code/endlesslethe/siwei-digit-recognizer-top20#General-function
class face_scanner(face_scannerTemplate):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)

  def file_loader_1_change(self, file, **event_args):
    """This method is called when a new file is loaded into this FileLoader"""
    self.image_1.source = self.file_loader_1.file
    self.image_1.visible = True
    age, gender, race, emotion = anvil.server.call('analyze', file)
    self.age.text = age
    self.race.text = race
    self.gender.text = gender
    self.emotion.text = emotion
    self.predictions.visible = True
    

   
    
      
    


