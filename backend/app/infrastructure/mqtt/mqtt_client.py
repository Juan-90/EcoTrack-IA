import paho.mqtt.client as mqtt

def on_message(client, userdata, msg):
    print(f"Received: {msg.payload.decode()}")

def start_mqtt():
    client = mqtt.Client()
    client.connect("localhost", 1883)
    client.subscribe("ecotrack/#")
    client.on_message = on_message
    client.loop_start()
    