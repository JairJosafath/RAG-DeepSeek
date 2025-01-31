#This script setsup your virtual environment and installs all the required packages
# You can manually run these scripts or use can run ./scripts/setup-venv.sh

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
source venv/Scripts/activate

# Install the required packages
pip install -r backend/requirements.txt