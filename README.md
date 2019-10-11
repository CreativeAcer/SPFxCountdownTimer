## countdown-timer

This SharePoint WebPart will display a timer that can countdown to a specific date and time.
The colors and title can be set through the propertypane.

### PropertyPane settings

#### Page 1:  
Title: sets the title that will be displayed above the timer.  
Repeat every: After the timer expires, timer will be reset to new date x amount of days in the future ( x is set here)  
ex: Repeat set to 5, when the timer expires on 10/10 a new timer will be set for 15/10  
Delay reset: This is the amount of hours the timer will remain at 0 0 0 0 before repeat is started  
End date and Time: This is the initial Time and Date for the countdown  
  
#### Page 2:
Font color: Color for the text  
Background color: Color for the background

### Example

![image](https://github.com/CreativeAcer/SPFxCountdownTimer/blob/master/example.PNG)

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

### Run the code in local workbench
url: https://localhost:4321/temp/workbench.html

npm run serve
or
gulp serve


This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

If you would like to build the spfx package for production you can use the following command:  
  
```bash
npm run package
```  

This will create the 'sppkg' file in the sharepoint directory.  
Place this file in your SharePoint app catalog.
