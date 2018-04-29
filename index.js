var builder = require('botbuilder');
var apiairecognizer = require('api-ai-recognizer'); 
var request = require('request');
var restify = require('restify');

//========================================================= // Bot Setup //========================================================= 
// Setup Restify Server 
var server = restify.createServer(); 
server.listen(process.env.port || process.env.PORT || 3978, function () { 
    console.log('%s listening to %s', server.name, server.url); 
}); 

// Create chat bot 
var connector = new builder.ChatConnector({ 
    appId: "", 
    appPassword: "" });

var bot = new builder.UniversalBot(connector); 
var recognizer = new apiairecognizer("f111f2d42d9041e3ac312979064f9164"); 
var intents = new builder.IntentDialog({ recognizers: [recognizer] }); 
bot.dialog('/',intents); 

intents.matches('weather',[ function(session,args){ 
    var city = builder.EntityRecognizer.findEntity(args.entities,'cities'); 
    if (city){ 
        var city_name = city.entity; 
        var url = "http://api.apixu.com/v1/current.json?key=46b3f1e4fafa4cb4a43112112182804&q=" + city_name; 
        request(url,function(error,response,body){ 
            body = JSON.parse(body); 
            temp = body.current.temp_c; 
            session.send("It's " + temp + " degrees celsius in " + city_name); 
        }); 
    }
    else{ 
        builder.Prompts.text(session, 'Which city do you want the weather for?'); 
    } 
}, function(session,results){ 
    var city_name = results.response; 
    var url = "http://api.apixu.com/v1/current.json?key=46b3f1e4fafa4cb4a43112112182804&q=" + city_name; 
    request(url,function(error,response,body){ 
        body = JSON.parse(body); 
        temp = body.current.temp_c; 
        session.send("It's " + temp + " degrees celsius in " + city_name); 
    }); 
} 
]);
intents.onDefault(function(session)
{ 
    session.send("Sorry...can you please rephrase?"); 
});