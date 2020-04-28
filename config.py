import os

def dblogin():
    if 'RDS_HOSTNAME' in os.environ:
        d = {
            'user' : os.environ['RDS_USERNAME'],
	    'password' : os.environ['RDS_PASSWORD'],
	    'host' : os.environ['RDS_HOSTNAME'],
	    'database' : os.environ['RDS_DB_NAME'],
	    'raise_on_warnings' : True
	}
        return d
