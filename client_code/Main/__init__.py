from ._anvil_designer import MainTemplate
from anvil import *
import anvil.server
import anvil.users
import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables

#https://www.kaggle.com/code/endlesslethe/siwei-digit-recognizer-top20#General-function
class Main(MainTemplate):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
   
    size_img = 28
    threshold_color = 100 / 255
    
    data_train = anvil.server.call('get_train')
    y_train = np.array(data_train.iloc[:, 0])
    x_train = np.array(data_train.iloc[:, 1:])

    data_test = anvil.server.call('get_test')
    y_test = np.array(data_test.iloc[:, 0])
    x_test = np.array(data_test.iloc[:, 1:])

    self.training_data_image.figure = self.show_image(x_train)

  def show_img(self, x, **event_args):
    plt.figure(figsize=(8,7))
    if x.shape[0] > 100:
        print(x.shape[0])
        n_imgs = 16
        n_samples = x.shape[0]
        x = x.reshape(n_samples, size_img, size_img)
        for i in range(16):
            plt.subplot(4, 4, i+1) #divide figure into 4x4 and choose i+1 to draw
            plt.imshow(x[i])
        plt.show()
    else:
        plt.imshow(x)
        plt.show()
      
    


