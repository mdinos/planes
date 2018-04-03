# planes

node project, clone to directory and type to go:

``` npm install ```

``` node server ```

then navigate to

``` http://127.0.0.1:3000 ```

to reach the server.

## main issues for this stage of development

Better security needed, sessions are currently fairly insecure.

## reflection

Features I wish to implement (and will continue to after the submission) include:
  
  Better formatting of modules
  
  Each session is editable - this would involve another table in the database, with modId as a foreign key
 
  Editable button for each module
  
  Delete button for each module
  
  Finish other pages on the site
  
  Better session security - at present you can just edit your userid to log in as anyone
  
  In a similar veil, randomised userids rather than auto incremented from the SQL server
  
  Improved validation - server side rather than just client side - insecure and open to browser tinkering
  
  Exportable sessions/modules to HTML page.
  
Used technologies and modules:
I tried to use as few modules as possible, wanting to write as much myself as possible. Hence the only additional modules I used were express as a server, body-parser to ease the process of passing data to the server, and mysql as a store. As a result, my scripts are relatively pure and I belive it makes it more readable and understandable, without requiring a lot of knowledge of different node modules.

Reality check: 
I could have spent all my working time on this for the last couple of months, and achieved only half of what I wanted. A large program was unachievable in the timeframe along with the rest of my workload. (time spent: approx. 2 weeks of exclusively working on this, ignoring my other modules)

## credits

Credit to Daniel Bruce for the icons on the website:
http://www.danielbruce.se