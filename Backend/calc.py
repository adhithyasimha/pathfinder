import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

class SimplePlanetarySystem:
    def __init__(self):
        # Simplified orbital parameters (semi-major axis in AU, eccentricity)
        self.planets = {
            'Mercury': (0.387, 0.206),
            'Venus': (0.723, 0.007),
            'Earth': (1.000, 0.017),
            'Mars': (1.524, 0.093),
            'Jupiter': (5.203, 0.048),
            'Saturn': (9.537, 0.054)
        }
    
    def calculate_position(self, planet, date):
        a, e = self.planets[planet]
        # Simplified calculation assuming circular orbits
        days_since_j2000 = (date - datetime(2000, 1, 1)).days
        mean_anomaly = (days_since_j2000 % int(365.25 * a)) / (365.25 * a) * 2 * np.pi
        x = a * np.cos(mean_anomaly)
        y = a * np.sin(mean_anomaly)
        return x, y

    def calculate_distance(self, planet1, planet2, date):
        x1, y1 = self.calculate_position(planet1, date)
        x2, y2 = self.calculate_position(planet2, date)
        distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        return distance

    def calculate_confidence(self, planet1, planet2, date):
        # Simplified confidence calculation based on orbital eccentricities
        e1 = self.planets[planet1][1]
        e2 = self.planets[planet2][1]
        confidence = 1 - (e1 + e2) / 2
        return confidence

    def plot_orbits_and_positions(self, date):
        plt.figure(figsize=(10, 10))
        colors = ['gray', 'orange', 'blue', 'red', 'brown', 'gold']
        for i, (planet, (a, _)) in enumerate(self.planets.items()):
            theta = np.linspace(0, 2*np.pi, 100)
            x = a * np.cos(theta)
            y = a * np.sin(theta)
            plt.plot(x, y, color=colors[i], linestyle='--', alpha=0.5)
            
            px, py = self.calculate_position(planet, date)
            plt.scatter(px, py, color=colors[i], s=50, label=planet)

        plt.title(f"Simplified Solar System on {date}")
        plt.xlabel("Distance (AU)")
        plt.ylabel("Distance (AU)")
        plt.legend()
        plt.grid(True, linestyle=':', alpha=0.5)
        plt.axis('equal')
        plt.show()

def main():
    system = SimplePlanetarySystem()
    
    # Prompt the user for a date, use today's date if no input is given
    date_input = input("Enter a date (YYYY-MM-DD) or press Enter to use today's date: ")
    
    if date_input:
        try:
            date = datetime.strptime(date_input, "%Y-%m-%d")
        except ValueError:
            print("Invalid date format. Using today's date instead.")
            date = datetime.now()
    else:
        date = datetime.now()
    
    print(f"Planetary Distances and Confidence for {date.date()}:")
    planets = list(system.planets.keys())
    for i in range(len(planets)):
        for j in range(i+1, len(planets)):
            planet1, planet2 = planets[i], planets[j]
            distance = system.calculate_distance(planet1, planet2, date)
            confidence = system.calculate_confidence(planet1, planet2, date)
            r_squared = confidence ** 2  # Simplified R-squared calculation
            
            print(f"{planet1} to {planet2}:")
            print(f"  Distance: {distance:.3f} AU")
            print(f"  Confidence: {confidence:.2f}")
            print(f"  R-squared: {r_squared:.4f}")
            print()

    system.plot_orbits_and_positions(date)

if __name__ == "__main__":
    main()
