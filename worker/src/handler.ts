/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Router } from './router';
import Ping from './routes/ping';
import Franklin from './routes/franklin';
import Content from './routes/content';

import type { Context } from './types';


export default function handleRequest(request: Request, ctx: Context) {
  const router = Router({ base: ctx.env.BASE_PATH });

  router
    .get('/(scripts|blocks|styles|icons)/*', Franklin)
    .get('/ping', Ping)
    .get('/us/*', Content)
    .get('/*', Content);

  return router.handle(request, ctx) as Promise<Response | undefined>;
}