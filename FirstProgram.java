package Introduction;
interface BicycleInterface {
    void changeCadence(int newValue);
    void changeGear(int newValue);
    void speedUp(int increment);
    void applyBrakes(int decrement);
}

class Bicycle implements BicycleInterface {
    int cadence = 0;
    int speed = 0;
    int gear = 1;
    static String name = "I am Good";

    public void changeCadence(int newValue){
        cadence = newValue;
    }

    public void changeGear(int newValue){
        gear = newValue;
    }
    
    public void speedUp(int increment){
        speed = speed + increment;
    }

    public void applyBrakes(int decrement){
        speed = speed - decrement;
    }

    void printStates(){
        System.out.println("cadence: " + cadence + " speed:" + speed + " gear:" +  gear);
    }
}

class DirtBike extends Bicycle {
    public void speedUp(int newValue){
        speed = speed + newValue;
    }

    void printStates(){
        System.out.println("speed " + speed);
        System.out.print("name " + name);
    }
}

public class FirstProgram {
    public static void main(String[] args){
        DirtBike dirtBike = new DirtBike();
        dirtBike.speedUp(100);
        dirtBike.speedUp(2000);
        dirtBike.printStates();
    }
}