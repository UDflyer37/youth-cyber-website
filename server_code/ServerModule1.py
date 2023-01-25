import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables
import anvil.server
from deepface import DeepFace


@anvil.server.callable
def analyze(img):
  #calling VGGFace
  model_name = "VGG-Face"
  model = DeepFace.build_model(model_name)
  output = DeepFace.analyze(img_path = img, actions = ['age', 'gender', 'race', 'emotion'])
  return print(obj["age"]," years old ",obj["dominant_race"])



