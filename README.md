# Tuning-PlaySite
## Team Members
1. Megha Chandra Nandyala
2. Wenzheng Zhao
3. Amisha Himanshu Somaiya
4. ShaoJung Kan
## Motivation
We are all team of 4 from Electrical and Computer Engineering department intrested in Machine Learning. Our focus was to do a useful visualization in the field of Machine Learning. After bouncing around with a couple of ideas, we decided to do *What happens in a ML Model*. Our initil story board was as follows:

![Story Flow](Images/Storyflow.jpg)

But after having a converstaion with TA Sebastin Santy, we decided to focus on one deliverable instead of trying to do everything about Model building. Preferring deep over broader insights. As we dig deep, we found one aspect of model building which is the most frustrating, hyper parameter tuning. There is a lot of guess work and multiple runs of model with different experiments. Even worse, the process of hyper parameter tuning from first run of the model to best performing version is rarely documented or explained. All most all papers gloss over the process that led to their final results. Replicating deep learning papers results with the same model is tough due to this black box of tuning steps. So, we decided to draw the insights in this process using visualization. Actually we want the user to explore and decide what he hyper parameter his model needs.
### Note
We started this with having final project as the final deliverable in mind. For this assignment, we decided to scope in to stick with setting up the basic interaction for further future explorations.
## Data
We couldn't find any dataset available with all the experiments of hyperparameters which was a major hurdle as we need a lot of data to infer insights. So we decided to do these experiments on our own but due to time constraints, we went with only ResNet50 model and trained it on CIFAR-10 dataset which consists 60000 images. 

For the choice of hyperparameters, 
1. The most important one is optimizer. We went with three popular optimizers people choose: Adam (perhaps 90% use this), SGD and RMSProp. 
2. For epochs, we chose 1 to 10 with an increment of 1 and later with an increment of 30 upto 150. 
3. Next for the batch size, we chose 16, 32 and 64. We could have gone for 128 but limited machine capabilities. 
4. Later one of the most important yet mostly guessed is learning rate. For this we choose 0.00001, 0.0001, 0.001, 0.01 and 0.1. 

So the total rows of data came upto 765($3*17*3*5$). For the performance metrics, we choose Accuracy, Loss and F1-score(to compensate Precision and Recall).
## Interactive Visualization
### Running Instructions
Access our visualization https://cse512-23s.github.io/Tuning-PlaySite/


