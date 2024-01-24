import os,shutil
for i in os.listdir():
    if i.endswith(".html"):
        shutil.move(os.getcwd()+'/'+i,os.getcwd()+'/'+i.split('.')[0]+'.ejs')