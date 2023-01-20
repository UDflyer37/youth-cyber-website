import anvil.files
from anvil.files import data_files
import anvil.google.auth, anvil.google.drive, anvil.google.mail
from anvil.google.drive import app_files
import anvil.users
import anvil.email
import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables
import anvil.server
import matplotlib.pyplot as plt
from azureml.opendatasets import MNIST

@anvil.server.callable
def display_image():
  mnist = MNIST.get_tabular_dataset()
  mnist_df = mnist.to_pandas_dataframe()
  mnist_df.info()
  return
  
  with open(data_files['mnist_train.csv']) as f:
      imageAsArray = f[0,:-1].reshape(28, 28)
      plt.imshow(imageAsArray, cmap='gray')
      image = plt.show()
  return image