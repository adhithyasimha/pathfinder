import matplotlib.pyplot as plt
from skyfield.api import load, Topos, utc
from datetime import datetime
import pytz

def fetch_planet_positions(date=None):
    # Load planetary data
    planets = load('de421.bsp')
    earth = planets['earth']
    mercury = planets['mercury']
    venus = planets['venus']
    mars = planets['mars']
    jupiter = planets['jupiter barycenter']
    saturn = planets['saturn barycenter']
    uranus = planets['uranus barycenter']
    neptune = planets['neptune barycenter']

    # Observer's location and time
    ts = load.timescale()
    if date:
        ist = pytz.timezone('Asia/Kolkata')
        t = ts.utc(datetime.strptime(date, '%Y-%m-%d').replace(tzinfo=ist))
    else:
        t = ts.now()
    observer = earth + Topos(latitude_degrees=0, longitude_degrees=0)

    # Get the positions of the planets relative to the observer
    positions = {
        'Mercury': observer.at(t).observe(mercury).apparent().position.au,
        'Venus': observer.at(t).observe(venus).apparent().position.au,
        'Earth': [0, 0, 0],  # taking earth as a reference 
        'Mars': observer.at(t).observe(mars).apparent().position.au,
        'Jupiter': observer.at(t).observe(jupiter).apparent().position.au,
        'Saturn': observer.at(t).observe(saturn).apparent().position.au,
        'Uranus': observer.at(t).observe(uranus).apparent().position.au,
        'Neptune': observer.at(t).observe(neptune).apparent().position.au,
    }

    return positions

def plot_positions(positions):
    plt.figure(figsize=(10, 10))

    # Plot each planet's position
    for planet, pos in positions.items():
        plt.scatter(pos[0], pos[1], label=planet)
        plt.text(pos[0], pos[1], planet, fontsize=9, ha='right')

    plt.xlabel('X (AU)')
    plt.ylabel('Y (AU)')
    plt.title('Planetary Positions')
    plt.legend()
    plt.grid(True)
    plt.show()

if __name__ == '__main__':
    date = input("Enter the date (YYYY-MM-DD) or leave blank for current date: ")
    positions = fetch_planet_positions(date if date else None)
    plot_positions(positions)