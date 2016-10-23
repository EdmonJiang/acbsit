On Error Resume Next 

strUserName= WScript.Arguments(0)
'wscript.echo strUserName
 
Set objConnection = CreateObject("ADODB.Connection") 
Set objCommand =   CreateObject("ADODB.Command") 
objConnection.Provider = "ADsDSOObject" 
objConnection.Open "Active Directory Provider" 
Set objCommand.ActiveConnection = objConnection 
 
objCommand.Properties("Page Size") = 1000 
 
objCommand.CommandText = _ 
    "<GC://dc=group,dc=atlascopco,dc=com>;(&(objectClass=User)" & _ 
        "(|(cn="&strUserName&")(sAMAccountName="&strUserName&")));userPrincipalName;Subtree"

Set objRecordSet = objCommand.Execute

objRecordSet.MoveFirst 
 
Wscript.Echo objRecordSet.Fields("userPrincipalName").Value	

Set objRecordSet = Nothing
Set objCommand = Nothing
Set objConnection = Nothing