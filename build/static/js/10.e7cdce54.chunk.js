(this["webpackJsonppaint-builder"]=this["webpackJsonppaint-builder"]||[]).push([[10],{1232:function(e,t,r){"use strict";r.r(t);var n,s=r(8),a=r(2),i=r.n(a),o=r(5),c=r(216),u=r(139),l=r(0),d=r(653),b=r(28),j=r(625),p=r(122),h=r(39),m=r(108),x=r(23),O=r(116),f=r(1233),g=r(1234),w=r(110),v=r(12),y=b.c.form(n||(n=Object(u.a)(["\n  width: 100%;\n"]))),S=function(e){var t=e.errors,r=e.isSubmitting,n=e.touched,s=e.values,a=e.handleBlur,i=e.handleChange,o=e.handleSubmit,u=Object(l.useState)(!1),d=Object(c.a)(u,2),b=d[0],j=d[1];return Object(v.jsxs)(y,{noValidate:!0,onSubmit:o,children:[t.submit&&Object(v.jsx)(O.d,{mt:2,mb:1,severity:"warning",children:t.submit}),Object(v.jsx)(O.y,{autoComplete:"off",type:"text",name:"usr",label:"Email or iRacing Customer ID number",variant:"outlined",color:"primary",value:s.usr,error:Boolean(n.usr&&t.usr),fullWidth:!0,helperText:n.usr&&t.usr,onBlur:a,onChange:i,margin:"normal"}),Object(v.jsxs)(O.m,{fullWidth:!0,margin:"normal",variant:"outlined",color:"primary",error:Boolean(n.password&&t.password),children:[Object(v.jsx)(O.s,{htmlFor:"password",children:"Password"}),Object(v.jsx)(O.v,{id:"password",name:"password",type:b?"text":"password",value:s.password,onBlur:a,onChange:i,endAdornment:Object(v.jsx)(O.r,{position:"end",children:Object(v.jsx)(O.q,{"aria-label":"toggle password visibility",onClick:function(){j(!b)},onMouseDown:function(e){e.preventDefault()},edge:"end",color:"default",children:b?Object(v.jsx)(f.a,{}):Object(v.jsx)(g.a,{})})}),labelWidth:70}),Object(v.jsx)(O.o,{id:"password-helper-text",children:t.password})]}),Object(v.jsx)(O.t,{component:m.b,to:"/auth/reset-password",color:"primary",children:"Forgot password?"}),Object(v.jsx)(O.g,{type:"submit",fullWidth:!0,variant:"contained",color:"primary",size:"large",disabled:r,my:5,children:"Log in"})]})};t.default=function(){var e=Object(h.d)(),t=Object(x.f)(),r=Object(h.e)((function(e){return e.authReducer.previousPath})),n=function(){var n=Object(o.a)(i.a.mark((function n(s,a){var o,c,u;return i.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:o=a.setErrors,c=a.setStatus,u=a.setSubmitting;try{e(Object(w.c)({usr:s.usr,password:s.password},(function(e){e&&t.push(r||"/")})))}catch(i){"Invalid Data",c({success:!1}),o({submit:"Invalid Data"}),u(!1)}case 2:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}();return Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)(p.a,{title:"Sign In"}),Object(v.jsxs)(O.f,{display:"flex",width:"100%",height:"100%",padding:10,alignItems:"center",justifyContent:"center",flexDirection:"column",bgcolor:"#333",borderRadius:20,children:[Object(v.jsx)(O.z,{variant:"h1",mb:5,children:"Sign In"}),Object(v.jsx)(j.b,{initialValues:{usr:"",password:"",submit:!1},validationSchema:d.b().shape({usr:d.c().max(255).required("Email/ID is required"),password:d.c().max(255).required("Password is required")}),onSubmit:n,children:function(e){return Object(v.jsx)(S,Object(s.a)({},e))}}),Object(v.jsxs)(O.z,{variant:"h4",align:"center",color:"textSecondary",children:["Not a member yet?",Object(v.jsx)(O.t,{component:m.b,to:"/auth/sign-up",color:"primary",ml:2,children:"Sign up"})]})]})]})}}}]);
//# sourceMappingURL=10.e7cdce54.chunk.js.map