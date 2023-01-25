import anvil.files
from anvil.files import data_files
import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables
import anvil.server
from deepface import DeepFace
import cv2
import matplotlib.pyplot as plt

@anvil.server.callable
def analyze(img):
  #calling VGGFace
  model_name = "VGG-Face"
  model = DeepFace.build_model(model_name)
  return DeepFace.analyze(img_path = img, actions = ['age', 'gender', 'race', 'emotion'])



