import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables
import anvil.server
import anvil.media
import cv2
from deepface import DeepFace



@anvil.server.callable
def analyze(file):
  #calling model to use for predictions
  models = ["VGG-Face", "Facenet", "Facenet512", "OpenFace", "DeepFace", "DeepID", "ArcFace", "SFace"]
  model_name = models[7]
  model = DeepFace.build_model(model_name)

  #load image file from https://facescanner.anvil.app/
  with anvil.media.TempFile(file) as filename:
    img = cv2.imread(filename)

  #use selected model to analyze image. Return output to https://facescanner.anvil.app/
  obj = DeepFace.analyze(img_path = file, actions = ['age', 'gender', 'race', 'emotion'])
  print(obj[0]['age'], obj[0]['dominant_gender'], obj[0]['dominant_race'], obj[0]['dominant_emotion'])
  return obj[0]['age'], obj[0]['dominant_gender'], obj[0]['dominant_race'], obj[0]['dominant_emotion']



