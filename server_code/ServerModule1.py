import anvil.google.auth, anvil.google.drive, anvil.google.mail
from anvil.google.drive import app_files
import anvil.users
import anvil.email
import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables
import anvil.server

@anvil.server.callable
def check_admin():
   if anvil.users.get_user():
      return True

@anvil.server.callable
@anvil.tables.in_transaction
def add_responses(age, frequency, methods, rating, comments):

  age_row = app_tables.age.get(options=age)
  age_row['num_responses'] = (age_row['num_responses'] or 0) + 1
  
  ratings_row = app_tables.ratings.get(options=rating)
  ratings_row['num_responses'] = (ratings_row['num_responses'] or 0) + 1
  
  frequency_row = app_tables.frequency.get(options=frequency)
  frequency_row['num_responses'] = (frequency_row['num_responses'] or 0) + 1
  
  for method in methods:
    method_row = app_tables.method.get(options=method)
    method_row['num_responses'] = (method_row['num_responses'] or 0) + 1
  
  app_tables.responses.add_row(age=age_row, frequency=frequency_row, method=method_row, rating=ratings_row, comments=comments)


@anvil.server.callable
def get_total_responses():
  return len(app_tables.responses.search())

@anvil.server.callable
def get_tables():
  ages = app_tables.age.search()
  frequency = app_tables.frequency.search()
  methods = app_tables.method.search()
  ratings = app_tables.ratings.search()
  return [ages, frequency, methods, ratings]



