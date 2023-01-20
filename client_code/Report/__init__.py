from ._anvil_designer import ReportTemplate
from anvil import *
import plotly.graph_objects as go
import anvil.server
import anvil.google.auth, anvil.google.drive
from anvil.google.drive import app_files
import anvil.users
import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables

from datetime import date


class Report(ReportTemplate):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
    
    self.date_label.text = date.today().strftime('%d %b %Y')
    self.total_label.text = anvil.server.call('get_total_responses')
    
    table_list = anvil.server.call('get_tables')
    plot_list = [self.age_plot, self.freq_plot, self.method_plot, self.rating_plot]
    
    for table, plot in zip(table_list, plot_list):
      plot.data = [go.Bar(x=[row['options'] for row in table],
                     y=[row['num_responses'] for row in table],
                     marker=dict(color='#FCA352'))]
      plot.layout = {'plot_bgcolor':'#E0E0E0', 'paper_bgcolor':'#E0E0E0'}
    
