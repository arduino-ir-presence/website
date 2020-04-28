# All website files for arduino-ir-presence website

To update website:
1. Run `zip -r archive.zip application.py config.py requirements.txt templates/ static/` in the repository directory to create a source zip file
2. Go to AWS > Elastic Beanstalk > AIP environment
3. Under "Running Version" select "Upload and deploy", then "Choose file"
4. Select the archive.zip file created
5. Click "Deploy"
