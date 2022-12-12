This dataset contains the data acquired during the expedition to Princess Elisabeth Antarctica Station in December 2016 and January 2017.

The data is organized in four folders. Each folder is a .zip file.


meteo.zip
*********
This folder contains the data from the two meteorological stations. Each subfolder station1 and station2 contains the same three files, where X is either 1 or 2:

csat_data_stationX.txt contains the CSAT3 ultrasonic anemometer data acquired at 10Hz. The file contains the following columns:
timestamp: The format is yyyymmdd_HHMMSS.SSS
ux: Wind speed in the x direction in m/s
uy: Wind speed in the y direction in m/s
uz: Wind speed in the z direction in m/s

young_data_stationX.txt contains the Young wind monitor data (two per station) with a temporal resolution of 1 min. The file contains the following columns:
timestamp: The format is yyyymmdd_HHMMSS.SSS
ws1_avg: Average wind speed of Young1 in m/s
ws1_max: Maximum wind speed of Young1 in m/s
ws1_std: Standard deviation of the wind speed of Young1 in m/s
wd1: Wind direction of Young1 in degrees
ws2_avg: Average wind speed of Young2 in m/s
ws2_max: Maximum wind speed of Young2 in m/s
ws2_std: Standard deviation of the wind speed of Young2 in m/s
wd2: Wind direction of Young2 in degrees

meteo_data_stationX.txt contains the data from the other sensors with a temporal resolution of 10 min. The file contains the following columns:
timestamp: The format is yyyymmdd_HHMMSS.SSS
ta: Air temperature in degrees Celsius
rh: Relative air humidity in %
hs: Distnace from snow surface to snow height sensor in m
tss: Snow surface temperature in Kelvin


smp.zip
*******
This folder contains the SnowMicroPen (SMP) measurements as .dat files

Each file is named as [SMPnum]_[date]_[time]_[info].dat where:
[SMPnum] is the consecutive identifier number of the SMP
[date] is given as yyyymmdd
[time] is given as HHMMSS
[info] is a string describing where the SMP was acquired

Each .dat file contains the following columns:
Depth [mm]: Penetration depth in mm
Force [N]: Resisting force in N


spc.zip
*******
This folder contains the data of the Snow Particle Counters installed at each of the two meteorological stations. The .txt file for each station contains the following columns:
timestamp: The format is yyyymmdd_HHMMSS.SSS
massflux: drifting snow massflux in kg m^(-2) s^(-1)
Nparticles_xxx: Number of particles of size xxx microns.

There are 64 such columns containing the particle size distribution at each timestep


tls.zip
*******
This folder contains the data acquired with the Terrestrial Laser Scanner. The subfolder pointclouds_glcs contains the scans as pointclouds in .txt files in the Global Coordinate System, which is UTM zone 34 south with the origin at one of the meteo stations.

Each file is named as [date]_[time]_oct_5.txt
[date] is given as yyyymmdd
[time] is given as HHMMSS
The suffix oct_5 means that a 5 cm octree filter was applied to the raw scans before exporting them.

Each file contains the following columns:
X[m]: X-coordinate of the point in m
Y[m]: Y-coordinate of the point in m
Z[m]: Z-coordinate of the point in m

The file smpPositions_glcs.txt contains the positions of the SMP measurements in the Global Coordinate System. The file contains the following columns:
SMPnum: SMP identifier number (see above)
X[m]: X-coordinate of the SMP in m
Y[m]: Y-coordinate of the SMP in m
Z[m]: Z-coordinate of the SMP in m (is always 0)
