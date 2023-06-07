### Page 3 Design Decisions :
#### Choice of Chart Type
This page aims to provide the user an informative and interactive view of the effect of different learning rates on the optimizer performance. We consider 3 optimizers : Adam, SGD and RMSprop. We visualize the effect of 5 learning rates on each of these. For the choice of chart type, we experimented with small multiples, group bar chart, density charts etc. but found a single chart with multi-line plot with user-interactions to be the most effective. 
#### Choice of Encodings
The goal of this visualization is to provide user 2 main interactivities : (1) compare different learning rates for each optimizer (2) compare different optimizers for each learning rate. Thus we choose the following encodings : 
-	X axis : Epochs 
-	Y axis : Validation Loss
-	Mark encoding (solid, dotted, dashed lines) : 3 Optimizers : Adam, RMSProp, SGD
-	Color encoding : 5 learning rates
We chose to encode learning rates with color and optimizers with marks and not vice-versa because if we gave mark encodings to learning rates, there would be 5 different marks (instead of 3 currently) and the user would be required to refer the legend multiple times to interpret the visualization, which would increase cognitive load for the user. Hence we chose color encodings for learning rates and mark encodings for optimizers.
Choice of Color Scheme 
The color scheme was chosen in consideration to be colorblindness compatible with reference to the following link. 
https://davidmathlogic.com/colorblind/#%23D81B60-%231E88E5-%23FFC107-%23004D40

#### Design Layout
<p align="center">

