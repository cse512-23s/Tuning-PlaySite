
### Page 4 Design Decisions :

#### Choice of Chart Type
This page aims to provide user with 2 informative interactions : (1) fine tuning of individual parameters of an optimizer for example : Adam and (2) performance comparison of optimizers for final optimizer selection and their change in performance at optimal and sub-optimal parameters.  
For the first aforementioned use case, we experimented with multiple line plot, small multiples, scatter plot, binned histograms etc. We found that 4 integrated subplots controlled with a single slider to be the most effective and expressive, the ‘4-in-1’, as we fondly called it in our team. 
For the second mentioned use case, we experimented with animated multi-line plots and line plots with drop-down menu. We found the chosen surface plot with global and local minima and allowed user interaction anywhere on the contours to be the most effective and expressive. 
####Design details for 4-in-1
In this plot, we visualize the hyper-parameter tuning for individual parameters of Adam : Beta1 and Beta2 for fixed epochs of 10 and 100.

#### Choice of Encodings
-	X axis : log10(learning rate)
-	Y axis : Validation Loss
-	Mark encoding : Line plot
-	Color encoding : single red color to maintain uniformity across all 4 sub-plots
-	Upper 2 sub-plots are for beta1 = 0
-	Lower 2 sub-plots are for beta1 = 0.9
-	Slider interactivity : Beta2 values in steps : (0.99, 0.999, 0.9999)
Blue color for slider and red color for line plot chosen to be compatible with color-blindness with reference to the following link :
https://davidmathlogic.com/colorblind/#%23D81B60-%231E88E5-%23FFC107-%23004D40

The X axis is kept as linear scale of log10(learning rate) instead of log scale to have magnified variations of loss visible for each log values of learning rate. The idea for this x axis scale was taken from the corresponding visualizations in Adam conference paper as cited in references below. Converting this to log scale instead, cramps the values in a smaller space and visualization of loss values at those points becomes difficult. 

#### Design Layout


