# Semantic HTML transformer worker

This worker translates HTML into semantic HTML for Franklin Admin Service.

It provides several HTTP routes proxying content, which is then rewritten in a way that is suitable for Franklin: everything happens in the context of an HTTP request to the worker trigger.