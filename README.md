# github-action-killswitch [WIP]

This project should provide a killswitch, you can use in a GitHub Action workflow. It allows you to sleep for a dedicated amount in your pipeline. 

If the killswitch is not triggered in that timeframe the deployment will proceed further.

If the killswitch is trigger, the action fails.