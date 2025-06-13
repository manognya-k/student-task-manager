import sys
import pickle

# Load model
with open("deadline_model.pkl", "rb") as f:
    model = pickle.load(f)

days_left = int(sys.argv[1])
prediction = model.predict([[days_left]])[0]
print(prediction)  # 1 = late, 0 = on-time
