package com.example.mobileapp;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.Vibrator;
import android.util.Log;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity implements SensorEventListener {

    private static final String TAG = "MainActivity";

    private SensorManager sensorManager;
    private Sensor sAcc, sPressure, sGyro, sMagnet, sLight, sTemp, sHumid;
    private Vibrator vibrator;

    TextView xValue, yValue, zValue;
    TextView xGyroValue, yGyroValue, zGyroValue;
    TextView xMagnetValue, yMagnetValue, zMagnetValue;
    TextView light, pressure, temp, humid;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        xValue = (TextView)findViewById(R.id.xValue);
        yValue = (TextView)findViewById(R.id.yValue);
        zValue = (TextView)findViewById(R.id.zValue);

        xGyroValue = (TextView)findViewById(R.id.xGyroValue);
        yGyroValue = (TextView)findViewById(R.id.yGyroValue);
        zGyroValue = (TextView)findViewById(R.id.zGyroValue);

        xMagnetValue = (TextView)findViewById(R.id.xMagnetValue);
        yMagnetValue = (TextView)findViewById(R.id.yMagnetValue);
        zMagnetValue = (TextView)findViewById(R.id.zMagnetValue);

        light = (TextView)findViewById(R.id.light);
        pressure = (TextView)findViewById(R.id.pressure);
        temp = (TextView)findViewById(R.id.temp);
        humid = (TextView)findViewById(R.id.humid);

        Log.d(TAG, "onCreate: Initializing Sensor Services");
        sensorManager = (SensorManager)getSystemService(Context.SENSOR_SERVICE);

        sAcc = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        if (sAcc != null) {
            sensorManager.registerListener(MainActivity.this, sAcc, SensorManager.SENSOR_DELAY_NORMAL);
            Log.d(TAG, "onCreate: Registered accelerometer listener");
        }
        else {
            xValue.setText("Accelerometer not supported");
            yValue.setText("");
            zValue.setText("");
        }

        sGyro = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
        if (sGyro != null) {
            sensorManager.registerListener(MainActivity.this, sGyro, SensorManager.SENSOR_DELAY_NORMAL);
            Log.d(TAG, "onCreate: Registered gyroscope listener");
        }
        else {
            xGyroValue.setText("Gyroscope not supported");
            yGyroValue.setText("");
            zGyroValue.setText("");
        }

        sMagnet = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
        if (sMagnet != null) {
            sensorManager.registerListener(MainActivity.this, sMagnet, SensorManager.SENSOR_DELAY_NORMAL);
            Log.d(TAG, "onCreate: Registered magnetometer listener");
        }
        else {
            xMagnetValue.setText("Magnetometer not supported");
            yMagnetValue.setText("");
            zMagnetValue.setText("");
        }

        sLight = sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT);
        if (sLight != null) {
            sensorManager.registerListener(MainActivity.this, sLight, SensorManager.SENSOR_DELAY_NORMAL);
            Log.d(TAG, "onCreate: Registered light sensor listener");
        }
        else {
            light.setText("Light sensor not supported");
        }

        sPressure = sensorManager.getDefaultSensor(Sensor.TYPE_PRESSURE);
        if (sLight != null) {
            sensorManager.registerListener(MainActivity.this, sPressure, SensorManager.SENSOR_DELAY_NORMAL);
            Log.d(TAG, "onCreate: Registered pressure sensor listener");
        }
        else {
            pressure.setText("Pressure sensor not supported");
        }

        sTemp = sensorManager.getDefaultSensor(Sensor.TYPE_AMBIENT_TEMPERATURE);
        if (sTemp != null) {
            sensorManager.registerListener(MainActivity.this, sTemp, SensorManager.SENSOR_DELAY_NORMAL);
            Log.d(TAG, "onCreate: Registered temperature sensor listener");
        }
        else {
            temp.setText("Temperature sensor not supported");
        }

        sHumid = sensorManager.getDefaultSensor(Sensor.TYPE_RELATIVE_HUMIDITY);
        if (sLight != null) {
            sensorManager.registerListener(MainActivity.this, sHumid, SensorManager.SENSOR_DELAY_NORMAL);
            Log.d(TAG, "onCreate: Registered humidity sensor listener");
        }
        else {
            humid.setText("Humidity sensor not supported");
        }

        vibrator = (Vibrator)getSystemService(VIBRATOR_SERVICE);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        Sensor sensor = event.sensor;
        if (sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            //Log.d(TAG, "onSensorChanged: X: " + event.values[0] + " Y: " + event.values[1] + " Z: " + event.values[2]);
            xValue.setText("accX: " + event.values[0]);
            yValue.setText("accY: " + event.values[1]);
            zValue.setText("accZ: " + event.values[2]);
        }
        else if (sensor.getType() == Sensor.TYPE_GYROSCOPE) {
            //Log.d(TAG, "onSensorChanged: X: " + event.values[0] + " Y: " + event.values[1] + " Z: " + event.values[2]);
            xGyroValue.setText("gyroX: " + event.values[0]);
            yGyroValue.setText("gyroY: " + event.values[1]);
            zGyroValue.setText("gyroZ: " + event.values[2]);
        }
        else if (sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {
            //Log.d(TAG, "onSensorChanged: X: " + event.values[0] + " Y: " + event.values[1] + " Z: " + event.values[2]);
            xMagnetValue.setText("magnetX: " + event.values[0]);
            yMagnetValue.setText("magnetY: " + event.values[1]);
            zMagnetValue.setText("magnetZ: " + event.values[2]);
        }
        else if (sensor.getType() == Sensor.TYPE_LIGHT) {
            //Log.d(TAG, "onSensorChanged: X: " + event.values[0] + " Y: " + event.values[1] + " Z: " + event.values[2]);
            light.setText("Light: " + event.values[0]);
            if (event.values[0] == 10) {
                vibrator.vibrate(40);
            }
        }
        else if (sensor.getType() == Sensor.TYPE_PRESSURE) {
            //Log.d(TAG, "onSensorChanged: X: " + event.values[0] + " Y: " + event.values[1] + " Z: " + event.values[2]);
            pressure.setText("Pressure: " + event.values[0]);
        }
        else if (sensor.getType() == Sensor.TYPE_AMBIENT_TEMPERATURE) {
            //Log.d(TAG, "onSensorChanged: X: " + event.values[0] + " Y: " + event.values[1] + " Z: " + event.values[2]);
            temp.setText("Temperature: " + event.values[0]);
        }
        else if (sensor.getType() == Sensor.TYPE_RELATIVE_HUMIDITY) {
            //Log.d(TAG, "onSensorChanged: X: " + event.values[0] + " Y: " + event.values[1] + " Z: " + event.values[2]);
            humid.setText("Humidity: " + event.values[0]);
        }
        else {
            // do nothing
        }
    }
}
