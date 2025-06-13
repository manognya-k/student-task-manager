import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import pickle

# Simulated training data
data = pd.DataFrame({
    'days_left': [10, 5, 2, 0, -1, -3, 7, 1],
    'late_submission': [0, 0, 1, 1, 1, 1, 0, 1]
})

X = data[['days_left']]
y = data['late_submission']

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LogisticRegression()
model.fit(X_train, y_train)

# Save model
with open("deadline_model.pkl", "wb") as f:
    pickle.dump(model, f)
