package lib.ldapSource;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import javax.naming.*;
import javax.naming.directory.*;


public class ldapUtil {

	protected static String MY_SEARCHBASE = "ou=members, o=kaiser permanente,c=us";
	protected static String MY_FILTER = null;
	protected String INITCTX = "com.sun.jndi.ldap.LdapCtxFactory";
	protected String SECURE_AUTH_METHOD = "simple";
	protected DirContext ctx;
	private String ldaphost;
	private String ldapuserid;
	private String ldappwd;

	public ldapUtil(String ldaphost, String ldapuserid, String ldappwd) {
		this.ldaphost = ldaphost;
		this.ldapuserid = ldapuserid;
		this.ldappwd = ldappwd;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void setLDAPDirContext() {
		Hashtable env = new Hashtable();
		env.put(Context.INITIAL_CONTEXT_FACTORY, INITCTX);
		env.put(Context.PROVIDER_URL, ldaphost);
		env.put(Context.SECURITY_AUTHENTICATION, SECURE_AUTH_METHOD);
		env.put(Context.SECURITY_PRINCIPAL, ldapuserid);
		env.put(Context.SECURITY_CREDENTIALS, ldappwd);
		try {
			this.ctx = new InitialDirContext(env);
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public NamingEnumeration searchLdap(String userid) throws NamingException {

		SearchControls constraints = new SearchControls();
		constraints.setSearchScope(SearchControls.SUBTREE_SCOPE);
		NamingEnumeration results = null;
		// performs the actual search
		// We give it a searchbase, a filter and the contraints containing the
		// scope of the search
		try {
			MY_FILTER = "(uid=" + userid + ")";
			results = ctx.search(MY_SEARCHBASE, MY_FILTER, constraints);

		} catch (Exception e) {
			System.out.println(e);
		}
		return results;
	}

	public void modifyLdap(String dn, String key, String value)
			throws NamingException {
			ModificationItem[] mods = new ModificationItem[1];
			mods[0] = new ModificationItem(DirContext.REPLACE_ATTRIBUTE,
					new BasicAttribute(key, value));
			ctx.modifyAttributes(dn , mods);
		}

	public String getDN(String userid) throws NamingException{
		String fullname=null;
		SearchControls constraints = new SearchControls();
		constraints.setSearchScope(SearchControls.SUBTREE_SCOPE);
		NamingEnumeration results = null;
		try {
			MY_FILTER = "(uid=" + userid + ")";
			results = ctx.search(MY_SEARCHBASE, MY_FILTER, constraints);
			//added line start
			SearchResult sr = (SearchResult) results.next();
			String name = sr.getName();
			fullname = name +","+MY_SEARCHBASE;
		} catch (Exception e) {
			System.out.println(e);
		}
		if (fullname==null){
			System.out.println("User : " + userid + "- not found in LDAP");
		}else{
			System.out.println("User found in LDAP. Fullname of user: " + fullname);
		}
		return fullname;
	}

	public String setLDAPSearchInMap(
			NamingEnumeration results, String attributeKey) throws Exception {
		Hashtable env = new Hashtable();
		HashMap<String, List> attrMap = new HashMap<String, List>();
		List<String> attrValueList = null;
		Object returnedValue = null;

		while (results != null && results.hasMore()) {
			SearchResult sr = (SearchResult) results.next();
			String dn = sr.getName();
			Attributes attrs = sr.getAttributes();
			for (NamingEnumeration ne = attrs.getAll(); ne.hasMoreElements();) {
				attrValueList = new ArrayList<String>();
				Attribute attr = (Attribute) ne.next();
				String attrID = (String) attr.getID();
				for (Enumeration vals = attr.getAll(); vals.hasMoreElements();) {
					String attrValue = vals.nextElement().toString();
					attrValueList.add(attrValue);
				}
				attrMap.put(attrID, attrValueList);

			}
		}
		List valueList = attrMap.get(attributeKey);
		returnedValue=valueList.get(0);
		return (String)returnedValue;
	}

	public void closeContext() {
		try {
			ctx.close();
		} catch (NamingException e) {
			e.printStackTrace();
		}
	}

	public String getValueFromLDAP(HashMap<String, List> attrMap,
			Properties ldapProperties){
		String key = null;
		Object returnValue = null;
		Enumeration<Object> keys = ldapProperties.keys();
		while (keys.hasMoreElements()) {
			key = (String) keys.nextElement();
			List valueList = attrMap.get(key);
			returnValue=valueList.get(0);
		}
		return (String) returnValue;
	}

	/**public void verifyLDAPUpdate(HashMap<String, List> attrMap,
			Properties ldapProperties) {

		List<String> attrValueList = null;
		String key = null;
		String value = null;
		String temp = null;

		Enumeration<Object> keys = ldapProperties.keys();
		ModificationItem[] mods = new ModificationItem[1];
		while (keys.hasMoreElements()) {
			key = (String) keys.nextElement();
			value = ldapProperties.getProperty(key);
			if (value.trim().equalsIgnoreCase("null")) {
				Assert.assertFalse(attrMap.containsKey(key)
						|| attrMap.containsKey(key.toLowerCase())
						|| attrMap.containsKey(key.toUpperCase()));


			}else if (value.trim().equalsIgnoreCase("notnull")) {
				Assert.assertTrue(attrMap.containsKey(key)
						|| attrMap.containsKey(key.toLowerCase())
						|| attrMap.containsKey(key.toUpperCase()));

			} else {
				System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@ Key :"+key);
				Assert.assertTrue(attrMap.containsKey(key)
						|| attrMap.containsKey(key.toLowerCase())
						|| attrMap.containsKey(key.toUpperCase()));
				List valueList = attrMap.get(key);
				Iterator itr = valueList.iterator();
				while (itr.hasNext()) {
					temp = (String) itr.next();
					Assert.assertTrue("Ldap attribute for "+key+" not modified ",temp.equalsIgnoreCase(value));
				}
			}
		}
	}
	**/

	public void deleteContext(String fullName) throws NamingException {
		if (fullName!=null){
			try {
				ctx.destroySubcontext(fullName);
			    //ctx.destroySubcontext("guid=4001706,ou=6,ou=members, o=kaiser permanente,c=us");
			    System.out.println("LDAP delete Success : "+fullName);
			} catch (Exception e) {
				System.out.println("LDAP delete Failed : "+fullName);
				throw new RuntimeException(e);
			}
		}
		else {
			System.out.println("No user deleted. User doesn't exist.");
		}
	}

}