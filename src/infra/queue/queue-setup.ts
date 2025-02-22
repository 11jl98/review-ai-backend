import "reflect-metadata";

import type { Channel } from "amqplib";
import { container } from "../ioc/container.js";
import { Queue } from "./queue.js";
import { TYPES } from "../ioc/types.js";
import { EVENTS } from "./events.js";
import { QUEUES } from "./queues-list.js";

async function queueSetup() {
  const queue = container.get<Queue>(TYPES.Queue);
  await queue.connect();
  const channel = await queue.createChannel();

  await createExchange(channel, EVENTS.RECEIVE_PR);
  await createExchange(channel, EVENTS.LOG);

  await createQueue(channel, QUEUES.REVIEW_PR);
  await createQueue(channel, QUEUES.LOG);

  await bindQueueToExchange(channel, QUEUES.REVIEW_PR, EVENTS.RECEIVE_PR);
  await bindQueueToExchange(channel, QUEUES.LOG, EVENTS.LOG);

  await channel.close();
  await queue.close();
}

async function createExchange(
  channel: Channel,
  exchange: string
): Promise<void> {
  await channel.assertExchange(exchange, "direct", { durable: true });
}

async function createQueue(channel: Channel, queue: string): Promise<void> {
  await channel.assertQueue(queue, { durable: true });
}

async function bindQueueToExchange(
  channel: Channel,
  queue: string,
  exchange: string
): Promise<void> {
  await channel.bindQueue(queue, exchange, "");
}

queueSetup();
