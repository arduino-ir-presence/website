from flask import Flask, request
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdf!'
socketio = SocketIO(app)

@app.route('/')
def hello_world():
    return 'Hello World\n'

@app.route('/updateRoomStatus', methods=['POST'])
def upload_data():
    id = request.form.getlist('secretID')[0]
    occupied = request.form.getlist('occupancy')[0]
    return '''Room ID: {} is currently occupied: {}\n'''.format(id, occupied)

@socketio.on('connect')
def connect():
    print('Connection aquired :D')

if __name__ == '__main__':
    socketio.run(app)
