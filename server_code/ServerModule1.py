import anvil.files
from anvil.files import data_files
import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables
import anvil.server
import pandas as pd

@anvil.server.callable
def get_train():
  return pd.read_csv(data_files['mnist_train.csv'])

@anvil.server.callable
def get_test():
  return pd.read_csv(data_files['mnist_test.csv'])

