export default {
  title: 'GC Net Data Portal',
  startText: 'Select stations in the menu to the left!',
//   smallInfo: `<h3>Automatic Weather Stations on Greenland</h3>
// As of the 1999 field season, several automatic weather stations (AWS) are collecting climate information on Greenland's ice sheet.<br />Hourly average data are transmitted via a satellite link (GOES or ARGOS) throughout the year.`,
  smallInfo: `<h3>Automatic Weather Stations (AWS)</h3>
    As of the 1995 field season, automatic weather stations (AWS) are collecting climate information on Greenland's ice sheet.<br />
    Click on a station to see all the data collected. Use the Navigation for more information and data requests.`,
  homeText: `Prof. Dr. Konrad Steffen is the principal investigator of this project.

  GC-Net Automated Weather Stations (AWS) are collecting climate information on Greenland's ice sheet. They are equipped with communication satellite transmitters that enable near-real time monitoring of weather conditions on the Greenland ice sheet. Transmission latency is typically 1-2 hours, and occasionally as long as 48 hours. All times displayed are Zulu = UTC.
  
  Hourly average data are transmitted via a satellite link (GOES or ARGOS) throughout the year. In addition, measurements are stored in solid state memory. The system is powered with two 100 Ah batteries, charged by a 10 or 20 W solar panel. The satellite data-link is powered by two separate 100 Ah batteries connected to a 20 W solar panel. This setup guarantees continuous data recordings and storage, even in the case of satellite transmission failure. For more information on the GC-NET see: <a href="http://cires1.colorado.edu/steffen/gcnet/" target="_blank">GC-Net@CIRES.colorado.edu.</a>
  <br />  
  <br />
  <strong><a href="https://www.wsl.ch/en/2020/08/director-konrad-steffen-tragically-killed-in-accident.html" target="_blank">Konrad Steffen died in an accident in Greenland on 8 August 2020.</a></strong>`,
  awsInfo: `<h3>Automatic Weather Stations (AWS)</h3>

  <p>As of the 1999 field season, 18 automatic weather stations (AWS) are collecting climate information on Greenland's ice sheet. Each AWS is equipped with a number of instruments to sample the following:</p>
  
  <ul>
  <li>air temperature, wind speed, wind direction, humidity, pressure</li>
  <li>accumulation rate at high temporal resolution to identify and resolve individual storms</li>
  <li>surface radiation balance in visible and infrared wavelengths</li>
  <li>sensible and latent heat flux fluxes</li>
  <li>snowpack conductive heat fluxes</li>
  </ul>
  
  <p>Hourly average data are transmitted via a satellite link (GOES or ARGOS) throughout the year. In addition, measurements are stored in solid state memory. The system is powered with two 100 Ah batteries, charged by a 10 or 20 W solar panel. The satellite data-link is powered by two separate 100 Ah batteries connected to a 20 W solar panel. This setup guarantees continuous data recordings and storage, even in the case of satellite transmission failure. The expected lifetime of the instrumentation is 5 years.</p>`,
  gcnetTransmissionsInfo: `<h3>Current GC-Net Transmissions</h3>
  
  <table align="right" width="120"><tr><td align="center"><a target="_blank" href="http://cires1.colorado.edu/steffen/gcnet/aws.html"><img src="http://cires1.colorado.edu/steffen/gcnet/images/awsLabeled110.jpg" width="110" height="148" hspace="5" border="0"></a><br><span class="caption">Click on image to see <a target="_blank" href="http://cires1.colorado.edu/steffen/gcnet/aws.html">full size</a> version of AWS.</span></td></tr></table>

<p>PARCA GC-Net Automated Weather Stations (AWS) are equipped with communication satellite transmitters that enable
near-real time monitoring of weather conditions on the Greenland ice sheet. Transmission latency is as short as 4 minutes, typically 1-2 hours, and occasionally as long as 48 hours. See graphs of the most recent transmissions in the links listed on the right side of this page.</p>

<p>For more information on the GC-NET see:</p>

<p>Steffen, K., J. E. Box, and W. Abdalati, 1996 "Greenland Climate Network: GC-Net", in Colbeck, S. C. Ed.
<a target="_blank" href="http://www.crrel.usace.army.mil/techinfo/techinfo.htm">CRREL</a> 96-27 Special Report on Glaciers, Ice Sheets and Volcanoes, trib. to M. Meier, pp. 98-103.</p>

<p>You can <a target="_blank" href="http://cires1.colorado.edu/steffen/gcnet/order/admin/station.php">request data via the Web</a> or download data from Humboldt and TUNU-N sites from our <a target="_blank" href="ftp://seaice.colorado.edu/pub/parca">FTP
Server</a>.</p>

<p>Dr. <a target="_blank" href="http://cires1.colorado.edu/science/groups/steffen/">Konrad Steffen</a> is the principal investigator of this project.</p>`,
  additionalInfo: `<h3>Notes</strong></h3>
  <ul>
  <li>There is no transmission from NASA-SE, Kulu, JAR3, or KAR.</li>
  <li>Kar, Kulu, and Aurora stations have been removed.</li>
  <li>Click <a target="_blank" href="http://cires1.colorado.edu/steffen/gcnet/radiation_and_cloud.html">here</a>
  to learn about the cloud amount estimates.</li>
  <li>Times are in UTC.</li>
  <li>For conversion of Julian day (Day of year) to calendar date, use ASCII data link.</li>
  <li>On the plots, observations are represented by square crosses.</li>
  <li>The plots are updated at 50 minutes into each hour.</li>
  <li>You may need to clear the memory cache when reloading updated files.</li>
  </ul>`,
  links: `<h3>See Also</h3>
  <ul>
  <li><a target="_blank" href="http://cires1.colorado.edu/steffen/gcnet/publications.html">publications</a></li>
  <li><a target="_blank" href="http://cires1.colorado.edu/science/groups/steffen/greenland/weatherlinks.html">Greenland Weather Links</a></li>
  </ul>`,
};
