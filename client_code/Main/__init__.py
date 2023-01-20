from ._anvil_designer import MainTemplate
from anvil import *
import anvil.server
import anvil.users
import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables


class Main(MainTemplate):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
    
    self.training_data_image.figure = self.display_image()
    
  def display_image(self, **event_args):
    mnist = anvil.server.call('get_train')
    imageAsArray = mnist[0,:-1].reshape(28, 28)
    plt.imshow(imageAsArray, cmap='gray')
    fig = plt.show()
    return fig
      
    


