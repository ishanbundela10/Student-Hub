# Backend project for git

this is a backend things.

jab hum public or temp banayege toh vo github pe push nhi kr skte kyuki vo folder hai or git files track krta hai toh jab use track krwana hai or push krna hai toh .gitkeep banate hai ushi folder me taki git us folder ko track kare.

.gitignore me hum vo file rkhte hai jo push nhi krni, uske liye gitignore generators bhi hai jo batadete hai kon kon si file ayegi gitignore me when project is of node or smth.

jab bhi .env variable ko production me push krege toh ye .env variables ko system se uthaya jata hai taki ye secure rhe ye file se nhi uthaye jate, ye .env push nhi hota github bhi warning deta hai toh push krne ke liye .env.sample banaunga jisme .env ka code rkhunga.

nodemon ek dev dependency hai jo sirf development me ayegi production me nhi jayegi.

.env file use krne ke liye require wala syntax use krna padta hai toh type: module se panga rheta hai.

ek or plugin hota hai prettier ye automatically fix krdeta hai indentation wagera, toh hum ek .prettierrc krke file banayege usme configurations rhege.
ek or file banti hai .prettierignore jis jis file me prettier ko ignore krna hai vo dedo