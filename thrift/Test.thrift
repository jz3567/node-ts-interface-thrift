
service UserService {
    bool isUser(1: string id);
    string getContent(1: string contentId); 
    list<string> getContentList(1: list<string> ids); 
    map<string, list<string>> getManyContentList(1: list<string> ids);
    
}

struct User {
    1: string id;
    2: string name;
}