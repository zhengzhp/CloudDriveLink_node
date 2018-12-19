import urllib
import urllib.request
import time
import json
import re
import pymongo

client = pymongo.MongoClient("mongodb://127.0.0.1:27017/")
db = client["baiduyun"]

Cookie = '''
  BAIDUID=BE3B8A12B7775C150691B9C80BA683E3:FG=1;
  PSTM=1543926436;
  BIDUPSID=2278F8AB3E39006F6B493CF41C5E2074;
  BDUSS=GZJT0JmRzB3TmRBT3BrRGtCbGpMNEl6QjhIRHlwbFlsQTlLeHV0S2RMRFJBUzVjQVFBQUFBJCQAAAAAAAAAAAEAAAAOf4M~y-TDzs7ez-sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANF0BlzRdAZce;
  BDSFRCVID=42-OJeC627gT7PJ93AlnUqAdKBEEvz3TH6aoulRMYU_MAuqDkrlsEG0PjU8g0KubbbIiogKK0mOTHv-F_2uxOjjg8UtVJeC6EG0P3J;
  H_BDCLCKID_SF=tJPfoK8XJK83fP36q46tMKCShUFstTDLB2Q-5KL-Jb3xMUJ_ejbNh-CAKtQbBMj436cEoMbdJJjofJR-XqrlBUuF5qQRabjQ-2TxoUJ_QCnJhhvG-45DytFebPRiJPr9QgbqslQ7tt5W8ncFbT7l5hKpbt-q0x-jLn7ZVJO-KKCKMDK4DMK;
  H_PS_PSSID=1421_21089_28019_26350_27751_27244_27542;
  delPer=0;
  PSINO=1;
  PANWEB=1;
  STOKEN=1e1b172b70fd52240bc9379fbde60eaab25c1e950aa5a1c3662f9cff0b7edd04;
  SCRC=f875829b5a354ee7fff65543853ff5c3;
  Hm_lvt_7a3960b6f067eb0085b7f96ff5e660b0=1543545524,1544522863;
  Hm_lpvt_7a3960b6f067eb0085b7f96ff5e660b0=1544522863;
  PANPSC=13209288732822932551%3AzKsuZfKzYZNDq8nNHZKF6un90oj%2BY%2FIsWNqhd0KbKnJEqM%2F3IgPFBeMBPHhdrtQsSrvFsiwiy%2BHrl7yf4dAZY04sVpe%2BKsgswW3bk5Zv5j7XG9GmBZpeFcwcVuRerGYPP9MHvdN9SJioEno4K01xOgfhBsDHPTy3ePth2nAgN8k7LpLTMOoLpffsbJHGVn%2BX8KSTqGvGNRuNxnsOGT0GjNR4Y0ybk%2FFgsHHN9wux3JA%3D'''
shareurl = "https://pan.baidu.com/mbox/msg/historysession"
t = time.time()


class bdpanMain:
    def __init__(self):
        self.t = int(round(t * 1000))
        self.bdstoken = "235092399cfaa54552fe0b7d46219527"
        self.channel = "chunlei"
        self.web = 1
        self.app_id = 250528
        self.logid = "MTU0NTIwNjk5MDcwMTAuOTQwMjI2OTAzMDIzMjIyNg=="
        self.clienttype = 0
        self.headers = {
            'Host': "pan.baidu.com",
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.8',
            'Cache-Control': 'max-age=0',
            'Referer': 'https://pan.baidu.com/mbox/homepage',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
            'Cookie': Cookie
        }

    def run(self):
        self.getGroupList()

    def getGroupList(self):
        try:
            # python3 在class调用引入模块的方法，方法是：模块名.类名.方法名
            # urllib.request=>urllib.request.Request
            req = urllib.request.Request(shareurl, headers=self.headers)
            f = urllib.request.urlopen(req)
            responseText = f.read().decode()
            # responseText = responseText.strip('() \n\t\r')
            # responseText = re.sub(r'\(\)', '', responseText)
            responseJson = json.loads(responseText)
            if responseJson['errno'] == 0:
                # print(responseJson['records'])
                for value in responseJson['records']:
                    grouplen = db.grouplist.find({'group_id':value['gid']}).count()
                    if(grouplen==0):
                        db.grouplist.insert({"name":value['name'],"group_id":value['gid']})
                        print('insert group_id:'+ value['gid'])
                    else:
                        print('group_id is true')
            else:
                print(responseJson['request_id'])
        except Exception as err:
            print('Exception: ', str(err))

    # def getListUser():


x = bdpanMain()
x.run()
