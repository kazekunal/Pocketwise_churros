import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
import sys
import json

# Load the document data passed as argument
document_data = json.loads(sys.argv[1])

# Process the monthly data (assuming 'monthlyData' is in the document_data)
def process_monthly_data_for_arima(document_data):
    monthly_data = document_data.get("monthlyData", [])
    df = pd.DataFrame(monthly_data)
    
    if df.empty:
        return pd.DataFrame()  # Handle empty data
    
    df['timestamp'] = pd.to_datetime(df['name'], format='%b', errors='coerce')
    df['timestamp'] = df['timestamp'].fillna(pd.to_datetime(df['name'], format='%B', errors='coerce'))
    df['timestamp'] = df['timestamp'].apply(lambda x: x.replace(year=2025) if x is not pd.NaT else x)
    df = df.sort_values('timestamp')
    df.set_index('timestamp', inplace=True)
    return df

# Process data and generate prediction
df = process_monthly_data_for_arima(document_data)

# Check if we have valid data
if df.empty:
    print("Error: No valid monthly data to process")
    sys.exit()

# ARIMA Model
expense_series = df['expense']
model = ARIMA(expense_series, order=(1, 1, 1))  # Adjust the order as necessary
model_fit = model.fit()

# Forecast for the next 6 months
forecast = model_fit.forecast(steps=6)

# Prepare the forecasted values for Firestore
forecast_values = forecast.tolist()  # Convert numpy array to list for easy storage in Firestore

# Print the result (this will be captured by the Firestore listener)
print(json.dumps(forecast_values))  # Output the predictions in JSON format
