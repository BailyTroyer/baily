/**
 * These are helpers to export proper types for trpc operations.
 *
 * @also @see https://trpc.io/docs/v9/infer-types#inference-helpers
 */

import { createReactQueryHooks } from "@trpc/react";
import type {
  inferProcedureOutput,
  inferProcedureInput,
  inferSubscriptionOutput,
} from "@trpc/server";

import type { ServerRouter } from "../server/routers/_app";

export const trpc = createReactQueryHooks<ServerRouter>();

/**
 * Enum containing all api query paths
 */
export type TQuery = keyof ServerRouter["_def"]["queries"];

/**
 * Enum containing all api mutation paths
 */
export type TMutation = keyof ServerRouter["_def"]["mutations"];

/**
 * Enum containing all api subscription paths
 */
export type TSubscription = keyof ServerRouter["_def"]["subscriptions"];

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  ServerRouter["_def"]["queries"][TRouteKey]
>;

/**
 * This is a helper method to infer the input of a query resolver
 * @example type HelloInput = InferQueryInput<'hello'>
 */
export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  ServerRouter["_def"]["queries"][TRouteKey]
>;

/**
 * This is a helper method to infer the output of a mutation resolver
 * @example type HelloOutput = InferMutationOutput<'hello'>
 */
export type InferMutationOutput<TRouteKey extends TMutation> =
  inferProcedureOutput<ServerRouter["_def"]["mutations"][TRouteKey]>;

/**
 * This is a helper method to infer the input of a mutation resolver
 * @example type HelloInput = InferMutationInput<'hello'>
 */
export type InferMutationInput<TRouteKey extends TMutation> =
  inferProcedureInput<ServerRouter["_def"]["mutations"][TRouteKey]>;

/**
 * This is a helper method to infer the output of a subscription resolver
 * @example type HelloOutput = InferSubscriptionOutput<'hello'>
 */
export type InferSubscriptionOutput<TRouteKey extends TSubscription> =
  inferProcedureOutput<ServerRouter["_def"]["subscriptions"][TRouteKey]>;

/**
 * This is a helper method to infer the asynchronous output of a subscription resolver
 * @example type HelloAsyncOutput = InferAsyncSubscriptionOutput<'hello'>
 */
export type InferAsyncSubscriptionOutput<TRouteKey extends TSubscription> =
  inferSubscriptionOutput<ServerRouter, TRouteKey>;

/**
 * This is a helper method to infer the input of a subscription resolver
 * @example type HelloInput = InferSubscriptionInput<'hello'>
 */
export type InferSubscriptionInput<TRouteKey extends TSubscription> =
  inferProcedureInput<ServerRouter["_def"]["subscriptions"][TRouteKey]>;
