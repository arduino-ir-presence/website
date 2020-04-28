from flask import Flask, request
from flask_socketio import SocketIO
from config import dblogin

application = Flask(__name__)
application.config['SECRET_KEY'] = 'asdf!'
socketio = SocketIO(application)

@application.route('/')
def hello_world():
    return dblogin()['user']

@application.route('/updateRoomStatus', methods=['POST'])
def upload_data():
    id = request.form.getlist('secretID')[0]
    occupied = request.form.getlist('occupancy')[0]
    return '''Room ID: {} is currently occupied: {}\n'''.format(id, occupied)

@socketio.on('connect')
def connect():
    print('Connection aquired :D')
     
if __name__ == '__main__':
    socketio.run(application)
    application.debug = True
    application.run()
