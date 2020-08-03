const adsSdk = require('facebook-nodejs-business-sdk');
const accessToken = 'EAAH5CAlN3LoBAKURAIcLxxYhemsulmVpzHH3QmPQLZBlcs6yS32XJvv08fqjPp9w23QQA9FkMCFPy5InMN0kyxIfR7GATTKCYo95e2cRDC2ZAv3wQmpX7PmEUdiK0tMUZB0WKq92O7yU8A7MqkkGM25UxYjiB5TApkzZB2G6pssPITj4ZAlyn';
const api = adsSdk.FacebookAdsApi.init(accessToken);
const AdAccount = adsSdk.AdAccount;
const Campaign = adsSdk.Campaign;
 
const insightsFields = ['campaign_id', 'campaign_name', 'account_id', 'account_name', 'clicks', 'impressions'];
const insightsParams = { date_preset: Campaign.DatePreset.today };
const staging = `"TOOLS"."DBO"."SA_TEST_PHASE2_SLACK_ALERTS_STAGING_CAMPAIGN"`;
 
// var insertSQL = `INSERT INTO ${staging} (CAMPAIGN_ID, CAMPAIGN_NAME, ACCOUNT_ID, ACCOUNT_NAME, SPEND, CLICKS, IMPRESSIONS) VALUES `;
 
getAccountData("706087093496276");
 
async function getAccountData (accountID) {
    var insightsFields = ['account_id', 'account_name', 'spend'];
    var insightsParams = { date_preset: Campaign.DatePreset.today };
 
    var account = new AdAccount(`act_${accountID}`);
    account
        .read([AdAccount.Fields.name, AdAccount.Fields.spend_cap])
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
        });
    let insights = await account.getInsights(insightsFields, insightsParams);
    let data = insights[0]["_data"];
    let campaignData = await getCampaignData(account);
    let result = {
        'account': `("${data["account_id"]}", "${data["account_name"]}", "${data["spend"]}")`,
        'campaign': campaignData
    };
    // console.log(result);
    return result;
}
 
async function getCampaignData (account) {
    var insightsFields = ['campaign_id', 'campaign_name', 'account_id', 'account_name', 'spend', 'clicks', 'impressions', 'ad_id'];
    var insightsParams = { date_preset: Campaign.DatePreset.today };
    var campaigns = await account.getCampaigns([Campaign.Fields.name, Campaign.Fields.id, Campaign.Fields.daily_budget]);
    var values = [];
    for (var c of campaigns) {
        let insights = await c.getInsights(insightsFields, insightsParams);
        console.log("Daily Budget: " + c.daily_budget);
        if(insights.length > 0){
            let data = insights[0]["_data"];
            values.push(`("${data["campaign_id"]}", "${data["campaign_name"]}", "${data["account_id"]}", "${data["account_name"]}", "${data["spend"]}", "${data["clicks"]}", "${data["impressions"]}")`);
        }
    }
    // console.log(values.join(", "));
    return values.join(", ");
}
 
 
// Relevant Links:
// https://www.npmjs.com/package/facebook-ads-sdk
// https://developers.facebook.com/docs/marketing-api/insights/parameters/v7.0
// https://developers.facebook.com/docs/marketing-api/reference/ad-campaign/#fields
// https://developers.facebook.com/docs/marketing-api/reference/ad-account#example
 
// ACCOUNT INSIGHT
// https://graph.facebook.com/v7.0/act_706087093496276/insights?access_token=EAAH5CAlN3LoBAKURAIcLxxYhemsulmVpzHH3QmPQLZBlcs6yS32XJvv08fqjPp9w23QQA9FkMCFPy5InMN0kyxIfR7GATTKCYo95e2cRDC2ZAv3wQmpX7PmEUdiK0tMUZB0WKq92O7yU8A7MqkkGM25UxYjiB5TApkzZB2G6pssPITj4ZAlyn&fields=impressions,spend,clicks,reach&date_preset=today
// BUDGET: https://graph.facebook.com/v7.0/act_706087093496276/?access_token=EAAH5CAlN3LoBAKURAIcLxxYhemsulmVpzHH3QmPQLZBlcs6yS32XJvv08fqjPp9w23QQA9FkMCFPy5InMN0kyxIfR7GATTKCYo95e2cRDC2ZAv3wQmpX7PmEUdiK0tMUZB0WKq92O7yU8A7MqkkGM25UxYjiB5TApkzZB2G6pssPITj4ZAlyn&fields=spend_cap&date_preset=today
 
// CAMPAIGN INSIGHT
// https://graph.facebook.com/v7.0/23845146662250616/insights?access_token=EAAH5CAlN3LoBAKURAIcLxxYhemsulmVpzHH3QmPQLZBlcs6yS32XJvv08fqjPp9w23QQA9FkMCFPy5InMN0kyxIfR7GATTKCYo95e2cRDC2ZAv3wQmpX7PmEUdiK0tMUZB0WKq92O7yU8A7MqkkGM25UxYjiB5TApkzZB2G6pssPITj4ZAlyn&fields=impressions,spend,clicks,reach,daily_budget&date_preset=today
// BUDGET: https://graph.facebook.com/v7.0/23845146662250616/?access_token=EAAH5CAlN3LoBAKURAIcLxxYhemsulmVpzHH3QmPQLZBlcs6yS32XJvv08fqjPp9w23QQA9FkMCFPy5InMN0kyxIfR7GATTKCYo95e2cRDC2ZAv3wQmpX7PmEUdiK0tMUZB0WKq92O7yU8A7MqkkGM25UxYjiB5TApkzZB2G6pssPITj4ZAlyn&fields=daily_budget&date_preset=today
 
 
// account.read([AdAccount.Fields.name])
//   .then((account) => {
//     account.getInsights(insightsFields, insightsParams)
//       .then((actInsights) => console.log(actInsights[0]["_data"]))
//       .catch(console.error)
//     return account.getCampaigns([Campaign.Fields.name])
//   })
//   .then((result) => {
//     campaigns = result
//     const campaign_ids = campaigns.map((campaign) => campaign.id)
//     const campaignInsightsParams = Object.assign({
//       level: 'campaign',
//       filtering: [{ field: 'campaign.id', operator: 'IN', value: campaign_ids }]
//     }, insightsParams)
//     const campaigsInsightsFields = insightsFields.concat('campaign_id')
//     return account.getInsights(campaigsInsightsFields, campaignInsightsParams)
//   })
//   .then((insights) => console.log(campaigns, insights))
//   .catch(console.error)