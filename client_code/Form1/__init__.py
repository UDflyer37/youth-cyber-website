from ._anvil_designer import Form1Template
from anvil import *
import anvil.server
import anvil.google.auth, anvil.google.drive
from anvil.google.drive import app_files
import anvil.users
import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables
from ..Survey import Survey
from ..Report import Report


class Form1(Form1Template):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
    self.content_panel.add_component(Survey(), full_width_row=True)
    anvil.server.call('get_total_responses')
    
    if anvil.server.call('check_admin'):
      self.report_link.visible = True
      self.login_link.visible = False
      self.logout_link.visible = True
    

  def report_link_click(self, **event_args):
    """This method is called when the link is clicked"""
    if anvil.server.call('check_admin'):
      self.content_panel.clear()
      self.content_panel.add_component(Report(), full_width_row=True)
      self.back_link.visible = True
      self.report_link.visible = False

  def login_link_click(self, **event_args):
    """This method is called when the link is clicked"""
    anvil.users.login_with_form()
    open_form('Form1')

  def back_link_click(self, **event_args):
    """This method is called when the link is clicked"""
    self.content_panel.clear()
    self.content_panel.add_component(Survey(), full_width_row=True)
    self.back_link.visible = False
    self.report_link.visible = True

  def logout_link_click(self, **event_args):
    """This method is called when the link is clicked"""
    anvil.users.logout()
    self.content_panel.clear()
    self.content_panel.add_component(Survey(), full_width_row=True)
    self.logout_link.visible = False
    self.login_link.visible = True
    self.report_link.visible = False









