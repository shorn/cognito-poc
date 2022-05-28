import React from "react";
import { navBrowserByAssign, serverLocationUrl } from "Util/WindowUtil";
import { ContainerCard } from "Design/ContainerCard";
import { PrimaryButton } from "Component/AppButton";
import { useServerInfo } from "Api/ServerInfoProvider";
import { TextSpan } from "Component/TextSpan";
import { NewWindowLink, zincGithubDirectDocUrl } from "Component/ExternalLinks";
import { ZincOAuthState } from "Shared/ApiTypes";
import { encodeBase64 } from "Util/Encoding";
import {
  facebookAuthnScope,
  facebookAuthorizeUrl,
  github,
  googleAuthnScope,
  googleAuthorizeUrl
} from "Shared/Constant";
import { useSignInContext } from "Auth/AuthProvider";

const githubAction = "github-direct";
const googleAction = "google-direct";
const facebookAction = "facebook-direct";
const twitterAction = "twitter-direct";

export function DirectSocialSignInContainer(){
  const serverInfo = useServerInfo();

  const signInContext = useSignInContext();

  async function githubSignIn(){
    // this is not an OIDC sign-in, github uses `,` to separate scopes
    const state: ZincOAuthState = {
      redirectUri: serverLocationUrl()
    }
    signInContext.setAction(githubAction);
    try {
      let loginUrl = `${github.authorize}` +
        `?client_id=${serverInfo.directAuthn.github.clientId}` +
        `&scope=${encodeURIComponent(github.authnScope)}` +
        `&response_type=code` +
        `&state=${encodeBase64(JSON.stringify(state))}`;
      navBrowserByAssign(loginUrl);
    }
    catch( err ){
      signInContext.setAction(undefined);
      throw err;
    }
  }

  async function googleSignIn(){
    const state: ZincOAuthState = {
      // this redirectUril is about the lambda redirect back our client
      redirectUri: serverLocationUrl()
    }
    signInContext.setAction(googleAction);
    try {
      let loginUrl = `${googleAuthorizeUrl}` +
        `?client_id=${serverInfo.directAuthn.google.clientId}` +
        `&scope=${encodeURIComponent(googleAuthnScope)}` +
        `&response_type=code` +
        /* this redirect_uri is about google redirecting to the lambda for hte 
        "authorization code grant" flow, beore it issues the id_token */
        `&redirect_uri=${serverInfo.directAuthn.google.issuer}/idpresponse` +
        `&state=${encodeBase64(JSON.stringify(state))}`;
      navBrowserByAssign(loginUrl);
    }
    catch( err ){
      signInContext.setAction(undefined);
      throw err;
    }
  }

  async function facebookSignIn(){
    const state: ZincOAuthState = {
      // this redirectUril is about the lambda redirect back our client
      redirectUri: serverLocationUrl()
    }
    signInContext.setAction(facebookAction);
    try {
      let loginUrl = `${facebookAuthorizeUrl}` +
        `?client_id=${serverInfo.directAuthn.facebook.clientId}` +
        `&scope=${encodeURIComponent(facebookAuthnScope)}` +
        `&response_type=code` +
        /* this redirect_uri is about google redirecting to the lambda for hte 
        "authorization code grant" flow, beore it issues the id_token */
        `&redirect_uri=${serverInfo.directAuthn.facebook.issuer}/idpresponse` +
        `&state=${encodeBase64(JSON.stringify(state))}`;
      navBrowserByAssign(loginUrl);
    }
    catch( err ){
      signInContext.setAction(undefined);
      throw err;
    }
  }

  async function twitterSignIn(){
    const state: ZincOAuthState = {
      // this redirectUri is about the lambda redirect back our client
      redirectUri: serverLocationUrl()
    }
    signInContext.setAction(twitterAction);
    try {
      /* this points to *our* lambda handler, because Twitter requires that we 
      pass the "app oauth_token" to their actual /authorize endpoint */  
      let loginUrl = `${serverInfo.directAuthn.twitter.issuer}/authorize` +
        `?state=${encodeBase64(JSON.stringify(state))}`;
      navBrowserByAssign(loginUrl);
    }
    catch( err ){
      signInContext.setAction(undefined);
      throw err;
    }
  }

  const disabled = !!signInContext.action;
  return <ContainerCard title={"Direct Social Sign-in"}>
    <div style={{display: "grid", 
      gridTemplateColumns: "8em 8em",
      justifyContent: "center",
      columnGap: "1em", rowGap: "1em",
      // the textspan following was too cramped
      marginBottom: ".5em"
    }}> 
      <PrimaryButton isLoading={signInContext.action === googleAction} 
        disabled={disabled} onClick={googleSignIn}
      >
        Google
      </PrimaryButton>
      <PrimaryButton isLoading={signInContext.action === githubAction} 
        disabled={disabled} onClick={githubSignIn}
      >
        Github
      </PrimaryButton>
      <PrimaryButton isLoading={signInContext.action === facebookAction} 
        disabled={disabled} onClick={facebookSignIn}
      >
        Facebook
      </PrimaryButton>
      <PrimaryButton isLoading={signInContext.action === twitterAction} 
        disabled={disabled} onClick={twitterSignIn}
      >
        Twitter
      </PrimaryButton>
    </div>
    <TextSpan>
      Sign in directly to the ID Provider,{" "}
      <NewWindowLink href={zincGithubDirectDocUrl}>without using Cognito
      </NewWindowLink>.
    </TextSpan>
  </ContainerCard>
}

